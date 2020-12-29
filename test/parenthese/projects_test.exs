defmodule Parenthese.ProjectsTest do
  use Parenthese.DataCase

  alias Parenthese.Projects

  describe "projects" do
    alias Parenthese.Projects.Project

    @valid_attrs %{
      category: "archi",
      cover_url: "https://example.org/1",
      date: "2010-04-17",
      description: "some description",
      flickr_id: "some flickr_id",
      location: "some location",
      status: "some status",
      short_description: "some short description",
      title: "some title",
      vimeo_ids: [],
      youtube_ids: [],
      published: true
    }
    @update_attrs %{
      category: "scenography",
      cover_url: "https://example.org/2",
      date: "2011-05-18",
      description: "some updated description",
      flickr_id: "some updated flickr_id",
      location: "some updated location",
      short_description: "some short description",
      status: "some updated status",
      title: "some updated title",
      vimeo_ids: [],
      youtube_ids: []
    }
    @invalid_attrs %{
      date: nil,
      description: nil,
      flickr_id: nil,
      location: nil,
      status: nil,
      title: nil,
      vimeo_ids: nil,
      youtube_ids: nil
    }

    def project_fixture(attrs \\ %{}) do
      {:ok, project} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Projects.create_project()

      project
    end

    test "published_projects/0 returns all projects" do
      project = project_fixture()
      assert Projects.published_projects() == [project]
    end

    test "get_project!/1 returns the project with given id" do
      project = project_fixture()
      assert Projects.get_project!(project.id) == project
    end

    test "create_project/1 with valid data creates a project" do
      assert {:ok, %Project{} = project} = Projects.create_project(@valid_attrs)
      assert project.date == "2010-04-17"
      assert project.description == "some description"
      assert project.flickr_id == "some flickr_id"
      assert project.location == "some location"
      assert project.status == "some status"
      assert project.title == "some title"
      assert project.vimeo_ids == []
      assert project.youtube_ids == []
    end

    test "create_project/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Projects.create_project(@invalid_attrs)
    end

    test "update_project/2 with valid data updates the project" do
      project = project_fixture()
      assert {:ok, %Project{} = project} = Projects.update_project(project, @update_attrs)
      assert project.date == "2011-05-18"
      assert project.description == "some updated description"
      assert project.flickr_id == "some updated flickr_id"
      assert project.location == "some updated location"
      assert project.status == "some updated status"
      assert project.title == "some updated title"
      assert project.vimeo_ids == []
      assert project.youtube_ids == []
    end

    test "update_project/2 with invalid data returns error changeset" do
      project = project_fixture()
      assert {:error, %Ecto.Changeset{}} = Projects.update_project(project, @invalid_attrs)
      assert project == Projects.get_project!(project.id)
    end

    test "delete_project/1 deletes the project" do
      project = project_fixture()
      assert {:ok, %Project{}} = Projects.delete_project(project)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_project!(project.id) end
    end

    test "change_project/1 returns a project changeset" do
      project = project_fixture()
      assert %Ecto.Changeset{} = Projects.change_project(project)
    end
  end
end
