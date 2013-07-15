function ($){
  var chee = {
    selector: 'code',
    tabReplace: '  ',
    lineBreaks: false,
    frontTheme: '',
    themePath: '',
    hPrevieTime: 500, //delay, before load scripts, after switch to preview mod
    hEditTime: 250, //depay, before load scripts, after keyup on split edit mod

    init: function() {
      this.tabReplace = Drupal.settings.cheeTabReplace;
      this.lineBreaks = Drupal.settings.cheeLineBreaks;
      this.frontTheme = Drupal.settings.cheeFrontTheme;
      this.themePath = "/" + Drupal.settings.cheePath + "/styles/" + Drupal.settings.cheeBackTheme + ".css";

      if (hljs) {
        this.hFrontCode();
        this.hBackCode();
      }
      else {
        return false;
      }
    },
    makeCssLine: function() {
      return '<link rel="stylesheet" id="chee" href="' + this.themePath + '" type="text/css" media="screen">';
    },
    wrapElement: function(el) {
      if ($(el).parent('pre') != 1) {
        $(el).wrap('<pre/>');
      }
    },
    // Highlight Code on Front end
    hFrontCode: function() {
      $(this.selector).each(function(index, element) {
        hljs.highlightBlock(element, chee.tabReplace, chee.lineBreaks);
        chee.wrapElement(element);
        $(element).parent('pre').addClass(chee.frontTheme);
      });
    },
    // Highlight Code on Back end
    hBackCode: function() {
      setTimeout(function() {
        var parentIFrame = $('.page-node-edit iframe').contents();

        var viewIFrame = parentIFrame.find('#epiceditor-previewer-frame'),
            viewIFrameContent = viewIFrame.contents();

        var editIFrame = parentIFrame.find('#epiceditor-editor-frame'),
            editIFrameContent = editIFrame.contents();

        var controls = parentIFrame.find('#epiceditor-utilbar');

        viewIFrameContent.find('head').eq(0).append(chee.makeCssLine());
        controls.click(function(){
          viewIFrameContent.find('pre code').each(function(index, element) {
            hljs.highlightBlock(element, chee.tabReplace);
          });
        });

        editIFrameContent.find('body').keyup(function(){
          if (viewIFrame.css('display') == 'block' && editIFrame.css('display') == 'block') {
            setTimeout(function() {
              viewIFrameContent.find('pre code').each(function(index, element) {
                hljs.highlightBlock(element, chee.tabReplace);
              });
            }, chee.hEditTime);
          }
        })
      }, this.hPrevieTime);
    }
  }

  Drupal.behaviors.chee = {
    attach: function (context, settings) {
      chee.init();
    }
  }
} (jQuery);
