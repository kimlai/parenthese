defmodule Parenthese.Flickr do
  @moduledoc """
  Fetch photos from a Flickr album
  """

  require Logger

  def album_photos(flickr_id) do
    with {:ok, 200, _, client_ref} <- fetch_flickr_album(flickr_id),
         {:ok, body} <- :hackney.body(client_ref),
         {:ok, %{"stat" => "ok", "photoset" => photoset}} <- Jason.decode(body) do
      {:ok, photoset["photo"]}
    else
      {:error, error} ->
        Logger.error("""
          Failed to fetch Flickr album #{flickr_id}
          Error message: #{error}
        """)

        {:error, "Les photos n'ont pas pu être chargées"}

      {:ok, %{"stat" => "fail", "message" => message}} ->
        Logger.error("""
          Failed to fetch Flickr album #{flickr_id}
          Error message: #{message}
        """)

        {:error, "Les photos n'ont pas pu être chargées"}
    end
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
end
