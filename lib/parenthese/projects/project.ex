defmodule Parenthese.Projects.Project do
  use Ecto.Schema
  import Ecto.Changeset

  @required_attrs [
    :title,
    :short_description,
    :description,
    :flickr_id,
    :location,
    :status,
    :date,
    :category,
    :cover_url
  ]

  @non_required_attrs [
    :very_short_description,
    :youtube_ids,
    :vimeo_ids,
    :location_coordinates_string,
    :client,
    :client_website,
    :budget
  ]

  @derive {Jason.Encoder, except: [:__meta__]}
  schema "projects" do
    field :budget, :string
    field :date, :string
    field :very_short_description, :string
    field :short_description, :string
    field :description, :string
    field :flickr_id, :string
    field :location, :string
    # a string formatted as "lat,long"
    field :location_coordinates_string, :string, virtual: true
    field :location_coordinates, :map
    field :status, :string
    field :title, :string
    field :vimeo_ids, {:array, :string}, default: []
    field :youtube_ids, {:array, :string}, default: []
    field :category, :string
    field :cover_url
    field :client
    field :client_website

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, @required_attrs ++ @non_required_attrs)
    |> validate_required(@required_attrs)
    |> parse_location_coordinates()
  end

  defp parse_location_coordinates(changeset) do
    coordinates_string = get_change(changeset, :location_coordinates_string)

    if coordinates_string && changeset.valid? do
      case String.split(coordinates_string, ",") do
        [lat, lng] ->
          put_change(changeset, :location_coordinates, %{
            lat: String.trim(lat),
            lng: String.trim(lng)
          })

        _ ->
          add_error(
            changeset,
            :location_coordinates_string,
            "Format de coordonnées géographiques non reconnu."
          )
      end
    else
      changeset
    end
  end
end
