defmodule Parenthese.Repo.Migrations.CreateProjects do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add(:title, :string)
      add(:short_description, :string)
      add(:description, :text)
      add(:flickr_id, :string)
      add(:youtube_ids, {:array, :string})
      add(:vimeo_ids, {:array, :string})
      add(:location, :string)
      add(:location_coordinates, :map)
      add(:status, :string)
      add(:date, :string)
      add(:category, :string)
      add(:cover_url, :string)

      timestamps()
    end
  end
end
