/*
 * Copyright (C) 2012 Interpreter Intelligence, Inc. <support@interpreterintelligence.com>
 *
 * <copyright notice>
 */

(function () {
    "use strict";

    //app analytics
    var domain = "app.interpreterintelligence.com";
    var urchin = "UA-21187080-7";

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', urchin]);
    _gaq.push(['_setDomainName', domain]);
    _gaq.push(['_setAllowLinker', true]);
    _gaq.push(['_trackPageview']);

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
