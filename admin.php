<?php
$app->on('admin.init', function() {
    $this->helper('admin')->addAssets('cockpitlayoutcomponentpreviews:assets/layout_component_previews.js');
});
