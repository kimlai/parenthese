defmodule ParentheseWeb.PageController do
  use ParentheseWeb, :controller

  alias Parenthese.Projects

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
end
