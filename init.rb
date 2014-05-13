Redmine::Plugin.register :a_common_libs do
  name 'A common libraries'
  author 'Danil Kukhlevskiy'
  description 'This is a plugin for including common libraries'
  version '0.0.1'
  url 'http://rmplus.pro/'
  author_url 'http://rmplus.pro/'

  settings :partial => 'settings/a_common_libs'
end

Rails.application.config.to_prepare do
  # ApplicationController.send(:include, ACommonLibs::ApplicationControllerPatch)
  ApplicationHelper.send(:include, ACommonLibs::ApplicationHelperPatch)

  if Rails.env.development?
    enable_assets_listeners = Setting.plugin_a_common_libs[:enable_assets_listeners]
    if enable_assets_listeners
      $listeners = []
      Rails.logger.debug "Init Listeners..."
      Redmine::Plugin.registered_plugins.each do |name, plugin|
        source = plugin.assets_directory
        if File.exist?(source) && File.directory?(source)
          destination = plugin.public_directory
          assets_listener = Listen.to source do |modified, added, removed|
            modified.each do |modified_path|
              if File.file?(modified_path)
                target = File.join(destination, modified_path.gsub(source, ''))
                FileUtils.cp(modified_path, target)
              end
            end
            added.each do |added_path|
              if File.directory?(added_path)
                FileUtils.mkdir_p(added_path)
              elsif File.file?(added_path)
                target = File.join(destination, added_path.gsub(source, ''))
                FileUtils.cp(added_path, target)
              end
            end
            removed.each do |removed_path|
              target = File.join(destination, removed_path.gsub(source, ''))
              FileUtils.remove_entry(target, true)
            end
          end
          Rails.logger.debug "Starting assets listener for plugin #{name}"
          assets_listener.start
          $listeners << assets_listener
        end
      end
      at_exit do
        Rails.logger.debug "Stopping listeners..."
        $listeners.each{ |listener| listener.stop }
      end
    end
  end
end

require 'a_common_libs/view_hooks'