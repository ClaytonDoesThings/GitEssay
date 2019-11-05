module.exports = function htmlPage(head, body, headOptions="", bodyOptions="") {
    return(`<head ${headOptions}>${head}</head><body ${bodyOptions}>${body}</body>`);
}