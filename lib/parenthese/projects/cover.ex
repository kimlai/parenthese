defmodule Parenthese.Projects.Cover do
  @moduledoc """
  Project thumbnails displayed on the homepage.
  Those are resized and uploaded to an S3 bucket.
  """

  def upload!(%{"cover" => %Plug.Upload{} = cover} = project_params) do
    uuid = Ecto.UUID.generate()
    original_path = cover.path
    thumbnail_path = Path.join(System.tmp_dir!(), "400x400.jpg")
    make_thumbnail(original_path, thumbnail_path)
    upload_to_s3!("project-covers/#{uuid}/#{cover.filename}", File.read!(original_path))
    upload_to_s3!("project-covers/#{uuid}/400x400.jpg", File.read!(thumbnail_path))

    Map.put(
      project_params,
      "cover_url",
      "https://#{System.get_env("S3_BUCKET")}.s3-eu-west-1.amazonaws.com/project-covers/#{uuid}"
    )
  end

  def upload!(project_params), do: project_params

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
    System.get_env("S3_BUCKET")
    |> ExAws.S3.put_object(path, content)
    |> ExAws.request!()
  end
end
