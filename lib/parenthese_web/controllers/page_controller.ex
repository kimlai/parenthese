defmodule ParentheseWeb.PageController do
  use ParentheseWeb, :controller

  alias Parenthese.RichText
  alias Parenthese.Projects
  alias Parenthese.Publications
  alias ParentheseWeb.LayoutView

  def index(conn, _params) do
    projects = Projects.list_projects()
    render(conn, "index.html", projects: projects)
  end

  def about(conn, _params) do
    render(conn, "about.html")
  end

  def contact(conn, _params) do
    render(conn, "contact.html")
  end

  def publications(conn, _params) do
    publications = Publications.list_publications()
    render(conn, "publications.html", publications: publications)
  end

  def map(conn, _params) do
    projects =
      Projects.list_projects()
      |> Enum.map(fn project -> Map.update!(project, :description, &RichText.from_draftjs/1) end)

    conn
    |> put_layout({LayoutView, "map_layout.html"})
    |> render("map.html", projects: projects)
  end
end
