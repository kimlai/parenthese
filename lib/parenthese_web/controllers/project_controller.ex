defmodule ParentheseWeb.ProjectController do
  use ParentheseWeb, :controller

  alias Parenthese.Projects
  alias Parenthese.Projects.Project

  def index(conn, _params) do
    projects = Projects.list_projects()
    render(conn, "index.html", projects: projects)
  end

  def new(conn, _params) do
    changeset = Projects.change_project(%Project{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"project" => project_params}) do
    project_params = upload_cover(project_params)

    case Projects.create_project(project_params) do
      {:ok, project} ->
        conn
        |> put_flash(:info, "Project created successfully.")
        |> redirect(to: Routes.project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    project = Projects.get_project!(id)

    photos =
      with {:ok, 200, _, client_ref} <- fetch_flickr_album(project.flickr_id),
           {:ok, body} <- :hackney.body(client_ref),
           {:ok, %{"stat" => "ok", "photoset" => photoset}} <- Jason.decode(body) do
        photoset["photo"]
      end

    render(conn, "show.html", project: project, photos: photos)
  end

  defp fetch_flickr_album(id) do
    params = [
      api_key: System.get_env("FLICKR_API_KEY"),
      method: "flickr.photosets.getPhotos",
      photoset_id: id,
      format: "json",
      nojsoncallback: 1
    ]

    :hackney.request(
      :get,
      "https://api.flickr.com/services/rest?#{URI.encode_query(params)}",
      [],
      "",
      follow_redirect: true
    )
  end

  def edit(conn, %{"id" => id}) do
    project = Projects.get_project!(id)
    changeset = Projects.change_project(project)
    render(conn, "edit.html", project: project, changeset: changeset)
  end

  def update(conn, %{"id" => id, "project" => project_params}) do
    project_params =
      project_params
      |> Map.put_new("youtube_ids", [])
      |> Map.put_new("vimeo_ids", [])
      |> upload_cover()

    project = Projects.get_project!(id)

    case Projects.update_project(project, project_params) do
      {:ok, project} ->
        conn
        |> put_flash(:info, "Project updated successfully.")
        |> redirect(to: Routes.project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", project: project, changeset: changeset)
    end
  end

  defp upload_cover(%{"cover" => %Plug.Upload{} = cover} = project_params) do
    uuid = Ecto.UUID.generate()
    original_path = cover.path
    thumbnail_path = Path.join(System.tmp_dir!(), "400x400.jpg")
    make_thumbnail(original_path, thumbnail_path)
    upload_to_s3!("project-covers/#{uuid}/#{cover.filename}", File.read!(original_path))
    upload_to_s3!("project-covers/#{uuid}/400x400.jpg", File.read!(thumbnail_path))

    Map.put(
      project_params,
      "cover_url",
      "https://parenthese.s3-eu-west-1.amazonaws.com/project-covers/#{uuid}"
    )
  end

  defp upload_cover(project_params), do: project_params

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
    ExAws.S3.put_object("parenthese", path, content)
    |> ExAws.request!()
  end

  def delete(conn, %{"id" => id}) do
    project = Projects.get_project!(id)
    {:ok, _project} = Projects.delete_project(project)

    conn
    |> put_flash(:info, "Project deleted successfully.")
    |> redirect(to: Routes.project_path(conn, :index))
  end
end
