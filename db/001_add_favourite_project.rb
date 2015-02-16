class AddFavouriteProject < ActiveRecord::Migration

  def up
    # compatibility with usability
    if !UserPreference.respond_to?(:favourite_project_id)
      add_column :user_preferences, :favourite_project_id, :integer
    end
  end

  def down
    remove_column :user_preferences, :favourite_project_id
  end

end