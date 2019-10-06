defmodule ParentheseWeb.Router do
  use ParentheseWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :admin do
    plug(:put_layout, {ParentheseWeb.LayoutView, "admin.html"})
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", ParentheseWeb do
    pipe_through(:browser)

    get("/", PageController, :index)
    get("/about", PageController, :about)
    get("/contact", PageController, :contact)
    get("/map", PageController, :map)
    get("/map/*path", PageController, :map)
    get("/publications", PageController, :publications)
    get("/project/:id", ProjectController, :show)
    get("/cube", PageController, :cube)
  end

  scope "/admin", ParentheseWeb do
    pipe_through([:browser, :admin])

    get("/", ProjectController, :index)
    resources("/projects", ProjectController, except: [:show, :index])
    resources("/publications", PublicationController, except: [:show])

    get("/flickr_photos/:flickr_id", ProjectController, :flickr_photos)
  end

  # Other scopes may use custom stacks.
  # scope "/api", ParentheseWeb do
  #   pipe_through :api
  # end
end
