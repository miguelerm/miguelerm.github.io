// Disqus.com script
(function(window, document, disqus_shortname, remote_hostname, disqus_enabled) {

    // css en tablas
    $('article.blog-post table').addClass('table').addClass('table-bordered').addClass('table-striped');


    if (window.location.hostname !== remote_hostname)
        return;

    // Comentarios Disqus

    if (disqus_enabled) {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }

    // google analytics

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-40921433-1', 'miguelerm.github.io');
        ga('send', 'pageview');
    
})(window, document, disqus_shortname, remote_hostname, disqus_enabled);