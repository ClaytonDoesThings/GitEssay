module.exports = `<script>
    function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(xmlHttp.response, false);
            } else if (xmlHttp.readyState ===4) {
                callback(xmlHttp.response, true);
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
</script>`;