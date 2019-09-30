defmodule Import do
  alias Parenthese.Projects.Project
  alias Parenthese.Repo

  def import_project(row) do
    row
    |> row_to_project()
    |> Repo.insert!()

    Ecto.Adapters.SQL.query!(
      Parenthese.Repo,
      "SELECT SETVAL('projects_id_seq', MAX(id)) FROM projects;"
    )
  end

  def row_to_project(row) do
    %Project{
      id: row.id,
      category: translate_category(row.category),
      cover_url: upload_cover(row.id),
      date: row.date,
      description: row.fullDescription,
      flickr_id: row.flickrId,
      inserted_at: translate_date(row.created),
      location: row.location,
      location_coordinates: geocode(row.location),
      short_description: row.shortDescription,
      status: translate_status(row.status),
      title: row.title,
      youtube_ids: String.split(row.youtube_ids, ",", trim: true),
      vimeo_ids: String.split(row.vimeo_ids, ",", trim: true)
    }
  end

  def translate_date({date, {hour, minute, second, _}}) do
    NaiveDateTime.from_erl!({date, {hour, minute, second}})
  end

  def translate_category(0), do: "archi"
  def translate_category(1), do: "microArchi"
  def translate_category(2), do: "microArchi"
  def translate_category(3), do: "scenography"
  def translate_category(4), do: "microArchi"

  def translate_status(1), do: "done"
  def translate_status(2), do: "doing"
  def translate_status(3), do: "rejected"
  def translate_status(4), do: "upcoming"

  defp upload_cover(id) do
    {:ok, 200, _, client_ref} =
      :hackney.request(
        :get,
        "http://collectifparenthese.com/thumbnails/project/#{id}/300.jpg",
        [],
        "",
        follow_redirect: true
      )

    {:ok, body} = :hackney.body(client_ref)
    original_path = Path.join(System.tmp_dir!(), "300.jpg")
    File.write!(original_path, body)
    thumbnail_path = Path.join(System.tmp_dir!(), "400x400.jpg")
    make_thumbnail(original_path, thumbnail_path)
    upload_to_s3!("project-covers/#{id}/300.jpg", File.read!(original_path))
    upload_to_s3!("project-covers/#{id}/400x400.jpg", File.read!(thumbnail_path))

    "https://#{System.get_env("S3_BUCKET")}.s3-eu-west-1.amazonaws.com/project-covers/#{id}"
  end

  defp make_thumbnail(original_path, thumbnail_path) do
    System.cmd(
      "convert",
      [
        original_path,
        "-resize",
        "400^>",
        "-gravity",
        "center",
        "-crop",
        "400x400+0+0",
        "-strip",
        thumbnail_path
      ]
    )
  end

  defp upload_to_s3!(path, content) do
    ExAws.S3.put_object(System.get_env("S3_BUCKET"), path, content)
    |> ExAws.request!()
  end

  def geocode(location) when is_binary(location) do
    {:ok, 200, _, client_ref} =
      :hackney.request(
        :post,
        "https://places-dsn.algolia.net/1/places/query",
        [],
        Jason.encode!(%{query: location}),
        follow_redirect: true
      )

    {:ok, body} = :hackney.body(client_ref)
    %{"hits" => [%{"_geoloc" => coordinates} | _]} = Jason.decode!(body)

    coordinates
  end
end

Sqlitex.with_db('parenthese.db', fn db ->
  Sqlitex.query!(
    db,
    """
    SELECT
      project.*,
      COALESCE(GROUP_CONCAT(youtubeid, ","), "") as youtube_ids,
      COALESCE(GROUP_CONCAT(vimeoid, ","), "") as vimeo_ids
    FROM project
    LEFT JOIN project_youtube y ON y.projectid = project.id
    LEFT JOIN project_vimeo v ON v.projectid = project.id
    GROUP BY project.id
    ORDER BY id ASC
    """
  )
  |> Enum.map(fn row -> Enum.into(row, %{}) end)
  |> Enum.map(&Import.import_project/1)
end)
