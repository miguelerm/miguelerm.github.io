// Disqus.com script
(function(window, document, disqus_shortname, remote_hostname) {
    if (window.location.hostname !== remote_hostname)
        return;
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})(window, document, disqus_shortname, remote_hostname);