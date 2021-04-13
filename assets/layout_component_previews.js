(function () {
    function text(value) {
        return '<span class="uk-margin-small-right">' + value + '</span>';
    }

    function badge(value) {
        return '<span class="field-layout-component-badge uk-badge uk-badge-outline uk-margin-small-right">' + value + "</span>";
    }

    function ellipsisHtml(html) {
        return '<span class="uk-display-inline-block uk-text-truncate">' + App.Utils.stripTags(html) + '</span>';
    }

    function assetPreview(asset, preview) {
        if (asset.image) {
            var path = asset.path;
            var imageUrl = path.match(/^(https?:|\/\/)/) ? path : encodeURI(ASSETS_URL + path);
            var previewImageUrl = imageUrl;
            if (preview.style && Array.isArray(asset.styles)) {
                for (var style of asset.styles) {
                    if (style.style === preview.style && style.path) {
                        previewImageUrl = encodeURI(SITE_URL + style.path);
                        break;
                    }
                }
            }
            var html = '<canvas class="uk-responsive-width uk-margin-small-right" width="50" height="50" style="background-image:url(' + previewImageUrl + ')"></canvas>';
            return '<a href="' + imageUrl + '" class="uk-display-inline-block" data-uk-lightbox>' + html + '</a>' + badge(asset.mime) + asset.title;
        } else {
            return badge(asset.mime) + asset.title;
        }
    }

    function previewComponent(componentDefinition, component) {
        var output = [];
        var componentName = component.component;
        var value = component.settings;
        if (Array.isArray(componentDefinition.options.preview)) {
            for (var preview of componentDefinition.options.preview) {
                if (preview.field) {
                    var v = value[preview.field];
                    if (!v) {
                        if (typeof v === "undefined") {
                            console.warn("Could not find field value " + preview.field + " in " + componentName);
                        }
                        continue;
                    }
                    var fieldDefinition = false;
                    for (var f of componentDefinition.fields) {
                        if (f.name === preview.field) {
                            fieldDefinition = f;
                            break;
                        }
                    }
                    if (fieldDefinition) {
                        // Add output according to field def
                        if (typeof preview.label == "undefined") {
                            preview.label = !preview.badge;
                        }
                        switch (fieldDefinition.type) {
                            case "boolean":
                                if (v) {
                                    if (preview.badge) {
                                        output.push(badge(fieldDefinition.label));
                                    } else {
                                        output.push(text(fieldDefinition.label));
                                    }
                                }
                                break;
                            case "collectionlink":
                                if (Array.isArray(v)) {
                                    // multiple collectionlink
                                    for (var val of v) {
                                        if (preview.badge) {
                                            output.push(badge(val.display));
                                        } else {
                                            output.push(text(val.display));
                                        }
                                    }
                                    break;
                                }
                                // single collectionlink
                                v = v.display;
                            // fall through
                            case "text":
                            case "number":
                            case "select":
                                if (preview.badge) {
                                    output.push(badge(v));
                                } else if (!!preview.label) {
                                    output.push(text(fieldDefinition.label + ": " + v));
                                } else {
                                    output.push(text(v));
                                }
                                break;
                            case "asset":
                                if (v.path) {
                                    output.push(assetPreview(v, preview));
                                }
                                break;
                            case "wysiwyg":
                                output.push(ellipsisHtml(v));
                                break;
                            case "repeater":
                                for (var item of v) {
                                    var val = item.value[preview.display];
                                    if (preview.badge) {
                                        output.push(badge(val));
                                    } else {
                                        output.push(text(val));
                                    }
                                }
                                break;
                            case "file":
                                output.push(text('<a href="' + SITE_URL + "/" + v + '" target="_blank">' + v + '</a>'));
                                break;
                            case "layout":
                                if (Array.isArray(v)) {
                                    output.push(text(fieldDefinition.label + ": " + v.length + " component(s)"));
                                }
                                break;
                            default:
                                console.warn("Unknown field type: " + fieldDefinition.type);
                        }
                    } else {
                        console.warn("Could not find field definition for " + preview.field + " in " + componentName);
                    }
                } else if (preview.text) {
                    output.push(text(preview.text));
                }
                if (preview.newline) {
                    output.push("<br/>");
                }
            }
        } else {
            console.log("missing layout component preview", componentName, value);
        }
        return output;
    }

    App.on("field.layout.component.preview", function (trigger) {
        var output = previewComponent(trigger.params.definition, trigger.params.component);
        if (output.length > 0) {
            trigger.params.output = output.join('');
        }
    });
})();