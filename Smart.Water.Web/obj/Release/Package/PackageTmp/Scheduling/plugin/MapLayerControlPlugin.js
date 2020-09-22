function MapLayerControlPlugin_Start() {

    $("#LayerControl_DIV").draggable({ handle: "#layerControl_title", containment: "document" });

    $("#LayerControl_DIV_tabs").tabs();

    $(".T_close").click(function () {

        $("#LayerControl_DIV").css("display", "none");
    
        //$("#tabs-LayerControl_tree").empty();
    });  
}