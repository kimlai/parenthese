defmodule ParentheseWeb.Router do
  use ParentheseWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ParentheseWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/about", PageController, :about
    get "/contact", PageController, :contact
    resources "/projects", ProjectController
  end

  # Other scopes may use custom stacks.
  # scope "/api", ParentheseWeb do
  #   pipe_through :api
  # end
end
