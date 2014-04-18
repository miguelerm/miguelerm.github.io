// Disqus.com script
(function(window, document, disqus_shortname, remote_hostname, disqus_enabled) {
    if (window.location.hostname !== remote_hostname)
        return;

    if (disqus_enabled) {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    }
})(window, document, disqus_shortname, remote_hostname, disqus_enabled);