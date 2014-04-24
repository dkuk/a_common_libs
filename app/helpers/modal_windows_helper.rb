module ModalWindowsHelper

  def link_to_modal_window(text, context = {}, html_options = nil, *parameters_for_method_reference)
    t = Time.now

    opts = {:class => "in_link link_to_modal", :id => "#{t.to_i}-#{t.nsec}"}
    html_options = html_options.nil? ? opts : (html_options.merge(opts){|key, oldval, newval| [newval.to_s,oldval.to_s].join(" ") })

    context = '#' unless context.is_a?(String) || context.is_a?(Hash)
    data = ''
    css = ''
    if html_options.has_key?(:class) && html_options[:class].include?('static_content_only')
      data = context
      context = '#'
    end

    if html_options.has_key?(:class) && html_options[:class].include?('click_out')
      css = 'click_out'
    end    

    html = link_to( text, context, html_options, *parameters_for_method_reference )
    html << content_tag(:div, data, :id => "modal-#{t.to_i}-#{t.nsec}", :class => "modal_window #{css}")

    # html = content_tag(:div, html, :class => "mw_frame")
    html.html_safe
  end

  def link_to_permanent_window(text, data = '', html_options = nil, *parameters_for_method_reference)
    t = Time.now

    opts = {:class => "in_link link_to_modal", :id => "#{t.to_i}-#{t.nsec}"}
    html_options = html_options.nil? ? opts : (html_options.merge(opts){|key, oldval, newval| [newval.to_s,oldval.to_s].join(" ") })

    data = '' unless data.is_a? String
    data = link_to('','#', :class => "icon close-icon close_modal_window", :style => "margin-top:-10px; margin-left:-8px;")+data

    html = content_tag(:div, data, :id => "modal-#{t.to_i}-#{t.nsec}", :class => "permanent_modal_window")
    html << link_to( text, '#', html_options, *parameters_for_method_reference )
    
    # html = content_tag(:div, html, :class => "mw_frame")
    html.html_safe
  end   

end