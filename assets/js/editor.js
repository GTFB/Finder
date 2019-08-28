"undefined" !== typeof jQuery && !function ($) {
  if ("undefined" !== typeof wp && wp.media) {
    var t = wp.media.view.MediaFrame.Select,
        i = (wp.media.controller.Library, wp.media.view.l10n),
        o = wp.media.view.Frame,
        s = null;


    wp.media.view.GTFBIs_AttachmentsBrowser = o.extend({
      tagName: "div",
      className: "attachments-browser gtfbis-attachments-browser",
      initialize: function () {

        _.defaults(this.options, {
          filters: !1,
          filteraccount: !1,
          search: !1,
          date: !1,
          display: !1,
          sidebar: !1,
          toolbar: !1,
          AttachmentView: wp.media.view.Attachment.Library
        });
        this.createEmbedView()
      },
      createEmbedView: function () {
        window.GTFBIsUploader = this;
        if (!this.$el.find('.GTFB_F_media_container').length) {
          this.$el.append($(GTFBEditorL10n.searchTemplate));
        }


      }
    });

    t.prototype.bindHandlers = function () {
      this.on("router:create:browse", this.createRouter, this);
      this.on("router:render:browse", this.browseRouter, this);
      this.on("content:create:browse", this.browseContent, this);
      this.on("content:create:gtfbis", this.gtfbis, this);
      this.on("content:render:upload", this.uploadContent, this);
      this.on("toolbar:create:select", this.createSelectToolbar, this);
    };
    t.prototype.browseRouter = function (e) {
      var t = {};

      t.upload = {text: i.uploadFilesTitle, priority: 20};
      t.browse = {
        text: i.mediaLibraryTitle,
        priority: 40
      };
      t.gtfbis = {text: GTFBEditorL10n.tabTitle, priority: 61};
      e.set(t);
      setTimeout(function () {
        jQuery(".media-frame .media-router a.media-menu-item:last-child").addClass("media-menu-item-gtfb-f");
      }, 800);
    };
    t.prototype.gtfbis = function (e) {
      var state = this.state();

      e.view = new wp.media.view.GTFBIs_AttachmentsBrowser({
        controller: this,
        model: state,
        AttachmentView: state.get("AttachmentView")
      });
    };
    t.prototype.envatoelements = function (e) {
      var t = this.state();
      e.view = new wp.media.view.EnvatoElements_AttachmentsBrowser({
        controller: this,
        model: t,
        AttachmentView: t.get("AttachmentView")
      })
    };
  }
}(jQuery);