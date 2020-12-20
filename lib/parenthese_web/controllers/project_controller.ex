defmodule ParentheseWeb.ProjectController do
  use ParentheseWeb, :controller

  alias Parenthese.Flickr
  alias Parenthese.Projects
  alias Parenthese.Projects.Cover
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
    project_params
    |> Cover.upload!()
    |> Projects.create_project()
    |> case do
      {:ok, project} ->
        redirect(conn, to: Routes.project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_flash(:error, "La saisie comporte des erreurs. Le projet n'a pas été enregistré.")
        |> render("new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    project = Projects.get_project!(id)

    photos = Flickr.album_photos(project.flickr_id)

    render(conn, "show.html",
      project: project,
      photos: photos,
      modal_template: "videos_modal.html"
    )
  end

  def flickr_photos(conn, %{"flickr_id" => flickr_id}) do
    case Flickr.album_photos(flickr_id) do
      {:ok, photos} ->
        json(conn, photos)

      {:error, error} ->
        conn
        |> put_status(500)
        |> json(error)
    end
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
      |> Cover.upload!()

    project = Projects.get_project!(id)

    case Projects.update_project(project, project_params) do
      {:ok, project} ->
        redirect(conn, to: Routes.project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_flash(:error, "La saisie comporte des erreurs. Le projet n'a pas été enregistré.")
        |> render("edit.html", project: project, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    project = Projects.get_project!(id)
    {:ok, _project} = Projects.delete_project(project)

    conn
    |> put_flash(:info, "Project deleted successfully.")
    |> redirect(to: Routes.project_path(conn, :index))
  end
end
