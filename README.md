# CockpitLayoutComponentPreviews
Addon to agentejo/Cockpit that renders layout component previews using component options.

Please note that only a subset of field types are handled at this time.

## Screenshot
![image](https://user-images.githubusercontent.com/51078938/114439950-da695500-9bc9-11eb-8305-93188838c778.png)

## Requirements
* LayoutComponents addon (for custom layout components with options JSON): https://github.com/agentejo/LayoutComponents
* Relies on the custom event trigger: `field.layout.component.preview` (https://github.com/agentejo/cockpit/pull/1349)

## Installation
Clone this repo into addon/CockpitLayoutComponentPreviews in your cockpit root directory.

## Usage
Add a ´preview´ key with an array of preview objects to the layout component options JSON.

### Supported types and extra configuration
#### boolean
Prints the field label if the field value is `true`.
* `field` name of the boolean field
* `badge` render as a badge (default: false)

Example:
```
{
    "preview": [
        {
            "field": "a_boolean_field",
            "badge": true
        }
    ]
}
```
#### collectionlink
Prints display value in a linked collectionlink item or for each in a set of items.
* `field` name of the collectionlink field
* `badge` render as a badge (overrides `label`)
* `label` will print the label if `true` and has a single linked collection item and badge is `false` (default: true)

Example:
```
{
    "preview": [
        {
            "field": "a_collectionlink_field",
            "label": false
        }
    ]
}
```
#### text, number, select
Prints value of the field.
* `field` name of the field
* `badge` render as a badge (overrides `label`)
* `label` will print the label if `true`

Example:
```
{
    "preview": [
        {
            "field": "a_text_or_number_or_select_field",
            "badge": true
        }
    ]
}
```
#### asset
Prints asset info and a thumbnail of the asset is an image.
* `field` name of the asset field
* `style` name of image style to use as thumbnail image (Requires https://github.com/pauloamgomes/ImageStyles addon)

Example:
```
{
    "preview": [
        {
            "field": "an_asset_field",
            "style": "thumbnail_style_name",
            "newline": true
        },
    ]
}
```
#### wysiwyg
Strips the html and prints the first line with ellipsis.
* `field` name of the wysiwyg field

Example:
```
{
    "preview": [
        {
            "field": "a_wysiwyg_field",
            "newline": true
        },
    ]
}
```
#### repeater
Prints the field specified with `display` for each item in the repeater.
* `field` name of the repeater field
* `display` name of field in each repeater item to print
* `badge` render as a badge

Example:
```
{
    "preview": [
        {
            "field": "a_repeater_field",
            "display": "field_in_repeater_item",
            "badge": true
        },
    ]
}
```
#### file
Prints a link to the file
* `field` name of the file field

Example:
```
{
    "preview": [
        {
            "field": "a_file_field"
        },
    ]
}
```
#### layout
Prints the number of component(s) in the layout field.
* `field` name of the layout field

Example:
```
{
    "preview": [
        {
            "field": "a_layout_field",
            "newline": true
        },
    ]
}
```
#### text
Prints the supplied text.
* `text` the text to print

Example:
```
{
    "preview": [
        {
            "text": "The text that should be printed!"
        },
    ]
}
```

### Linebreak after preview print
Add `newline: true` to any preview object to add linebreak after it is printed.
