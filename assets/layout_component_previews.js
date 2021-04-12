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

    function assetPreview(asset, p) {
        if (asset.image) {
            var path = asset.path;
            var imageUrl = path.match(/^(https?:|\/\/)/) ? path : encodeURI(ASSETS_URL + path);
            var previewImageUrl = imageUrl;
            if (p.style && Array.isArray(asset.styles)) {
                for (var style of asset.styles) {
                    if (style.style === p.style && style.path) {
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

    function previewComponent(def, component, output) {
        var componentName = component.component;
        var value = component.settings;
        if (def.options.preview) {
            for (var p of def.options.preview) {
                if (p.field) {
                    var v = value[p.field];
                    if (!v) {
                        if (typeof v === "undefined") {
                            console.warn("Could not find field value " + p.field + " in " + componentName);
                        }
                        continue;
                    }
                    var fieldDef = false;
                    for (var f of def.fields) {
                        if (f.name === p.field) {
                            fieldDef = f;
                            break;
                        }
                    }
                    if (fieldDef) {
                        // Add output according to field def
                        if (typeof p.label == "undefined") {
                            p.label = !p.badge;
                        }
                        switch (fieldDef.type) {
                            case "boolean":
                                if (v) {
                                    if (p.badge) {
                                        output.push(badge(fieldDef.label));
                                    } else {
                                        output.push(text(fieldDef.label));
                                    }
                                }
                                break;
                            case "collectionlink":
                                if (Array.isArray(v)) {
                                    // multiple collectionlink
                                    for (var val of v) {
                                        if (p.badge) {
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
                                if (p.badge) {
                                    output.push(badge(v));
                                } else if (!!p.label) {
                                    output.push(text(fieldDef.label + ": " + v));
                                } else {
                                    output.push(text(v));
                                }
                                break;
                            case "asset":
                                if (v.path) {
                                    output.push(assetPreview(v, p));
                                }
                                break;
                            case "wysiwyg":
                                output.push(ellipsisHtml(v));
                                break;
                            case "repeater":
                                for (var item of v) {
                                    var val = item.value[p.display];
                                    if (p.badge) {
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
                                    output.push(text(fieldDef.label + ": " + v.length + " component(s)"));
                                }
                                break;
                            default:
                                console.warn("Unknown field type: " + fieldDef.type);
                        }
                    } else {
                        console.warn("Could not find field definition for " + p.field + " in " + componentName);
                    }
                } else if (p.text) {
                    output.push(text(p.text));
                }
                if (p.newline) {
                    output.push("<br/>");
                }
            }
        } else {
            console.log("missing layout component preview", componentName, value);
        }
    }

    App.on("field.layout.component.preview", function (trigger) {
        previewComponent(trigger.params.def, trigger.params.component, trigger.params.output);
    });
})();