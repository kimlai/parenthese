defmodule Import do
  alias Parenthese.Publications.Publication
  alias Parenthese.Repo

  def import_publication(row) do
    row
    |> row_to_publication()
    |> Repo.insert!()

    Ecto.Adapters.SQL.query!(
      Parenthese.Repo,
      "SELECT SETVAL('publications_id_seq', MAX(id)) FROM publications;"
    )
  end

  def row_to_publication(row) do
    %Publication{
      id: row.id,
      date: row.date,
      journal: row.journal,
      inserted_at: translate_date(row.created),
      title: row.title,
      project: row.project,
      url: row.url
    }
  end

  def translate_date({date, {hour, minute, second, _}}) do
    NaiveDateTime.from_erl!({date, {hour, minute, second}})
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
