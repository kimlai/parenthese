defmodule ParentheseWeb.PageController do
  use ParentheseWeb, :controller

  alias Parenthese.Projects
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

  def map(conn, _params) do
    projects = Projects.list_projects()

    conn
    |> put_layout({LayoutView, "map_layout.html"})
    |> render("map.html", projects: projects)
  end
end
