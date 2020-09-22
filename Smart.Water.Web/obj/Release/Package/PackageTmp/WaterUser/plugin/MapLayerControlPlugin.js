function MapLayerControlPlugin_Start() {

    $("#LayerControl_DIV").draggable({ containment: "#exampleTabsOne" });

    $("#LayerControl_DIV_tabs").tabs();

    $(".T_close").click(function () {

        $("#LayerControl_DIV").css("display", "none");
    
        //$("#tabs-LayerControl_tree").empty();
    });  
}