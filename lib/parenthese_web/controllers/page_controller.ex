defmodule ParentheseWeb.PageController do
  use ParentheseWeb, :controller

  alias Parenthese.Projects

  def index(conn, _params) do
    projects = Projects.list_projects()
    render(conn, "index.html", projects: projects)
  end
end
