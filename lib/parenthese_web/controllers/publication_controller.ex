defmodule ParentheseWeb.PublicationController do
  use ParentheseWeb, :controller

  alias Parenthese.Publications
  alias Parenthese.Publications.Publication

  def index(conn, _params) do
    publications = Publications.list_publications()
    render(conn, "index.html", publications: publications)
  end

  def new(conn, _params) do
    changeset = Publications.change_publication(%Publication{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"publication" => publication_params}) do
    case Publications.create_publication(publication_params) do
      {:ok, publication} ->
        conn
        |> put_flash(:info, "Publication created successfully.")
        |> redirect(to: Routes.publication_path(conn, :show, publication))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    publication = Publications.get_publication!(id)
    render(conn, "show.html", publication: publication)
  end

  def edit(conn, %{"id" => id}) do
    publication = Publications.get_publication!(id)
    changeset = Publications.change_publication(publication)
    render(conn, "edit.html", publication: publication, changeset: changeset)
  end

  def update(conn, %{"id" => id, "publication" => publication_params}) do
    publication = Publications.get_publication!(id)

    case Publications.update_publication(publication, publication_params) do
      {:ok, publication} ->
        conn
        |> put_flash(:info, "Publication updated successfully.")
        |> redirect(to: Routes.publication_path(conn, :show, publication))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", publication: publication, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    publication = Publications.get_publication!(id)
    {:ok, _publication} = Publications.delete_publication(publication)

    conn
    |> put_flash(:info, "Publication deleted successfully.")
    |> redirect(to: Routes.publication_path(conn, :index))
  end
end
