Redmine::Plugin.register :a_common_libs do
  name 'A common libraries'
  author 'Danil Kukhlevskiy'
  description 'This is a plugin for including common libraries'
  version '1.1.3'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings default: {empty: true}, partial: 'settings/a_common_libs'

  menu :custom_menu, :us_favourite_proj_name, nil, caption: Proc.new{ ('<div class="title">' + User.current.favourite_project.name + '</div>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_issues, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues" class="no_line"><span>' + I18n.t(:label_issue_plural) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_new_issue, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues/new" class="no_line"><span>' + I18n.t(:label_issue_new) + '</span></a>').html_safe}, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
  menu :custom_menu, :us_favourite_proj_wiki, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/wiki" class="no_line"><span>' + I18n.t(:label_wiki) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) && User.current.favourite_project.module_enabled?(:wiki) }
  menu :custom_menu, :us_favourite_proj_dmsf, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/dmsf" class="no_line"><span>' + I18n.t(:label_dmsf) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) && User.current.favourite_project.module_enabled?(:dmsf) }
  menu :custom_menu, :us_new_issue, nil, caption: Proc.new{ ('<a href="/projects/'+User.current.favourite_project.identifier+'/issues/new" class="no_line"><span>' + I18n.t(:us_of_issue) + '</span></a>').html_safe }, if: Proc.new { User.current.logged? && User.current.favourite_project.is_a?(Project) }
end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, ACommonLibs::ApplicationHelperPatch)
  User.send(:include, ACommonLibs::UserPatch)
  SettingsController.send(:include, ACommonLibs::SettingsControllerPatch)
end

require 'a_common_libs/view_hooks'
