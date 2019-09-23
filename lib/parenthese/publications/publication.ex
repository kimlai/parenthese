defmodule Parenthese.Publications.Publication do
  use Ecto.Schema
  import Ecto.Changeset

  schema "publications" do
    field :date, :string
    field :journal, :string
    field :project, :string
    field :title, :string
    field :url, :string

    timestamps()
  end

  @doc false
  def changeset(publication, attrs) do
    publication
    |> cast(attrs, [:title, :project, :journal, :url, :date])
    |> validate_required([:title, :project, :journal, :url, :date])
  end
end
