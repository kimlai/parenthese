defmodule Import do
  alias Parenthese.Publications.Publication
  alias Parenthese.Repo

  def import_publication(row) do
    row
    |> row_to_publication()
    |> Repo.insert!()
  end

  def row_to_publication(row) do
    %Publication{
      id: row.id,
      date: row.date,
      journal: row.journal,
      inserted_at: NaiveDateTime.from_iso8601!(row.created),
      title: row.title,
      project: row.project,
      url: row.url
    }
  end
end

Sqlitex.with_db('parenthese.db', fn db ->
  Sqlitex.query!(
    db,
    """
    SELECT * FROM publication ORDER BY id ASC
    """
  )
  |> Enum.map(fn row -> Enum.into(row, %{}) end)
  |> Enum.map(&Import.import_publication/1)
end)
