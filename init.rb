Redmine::Plugin.register :a_common_libs do
  name 'A common libraries'
  author 'Danil Kukhlevskiy'
  description 'This is a plugin for including common libraries'
  version '1.0.9'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings :default => {'empty' => true}, :partial => 'settings/a_common_libs'
end

Rails.application.config.to_prepare do
  ApplicationHelper.send(:include, ACommonLibs::ApplicationHelperPatch)
  SettingsController.send(:include, ACommonLibs::SettingsControllerPatch)
end

require 'a_common_libs/view_hooks'
