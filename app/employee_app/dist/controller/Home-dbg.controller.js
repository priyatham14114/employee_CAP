sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], (Controller, Fragment, JSONModel) => {
    "use strict";

    return Controller.extend("com.app.employeeapp.controller.Home", {
        onInit() {
            const newEmployeeModel = new JSONModel({
                first_Name: "",
                last_Name: "",
                gender: "",
                age: "",    
                email: "",
                phone: "",
                address: [
                    {
                        city: "",
                        pincode: "",
                        street: "",
                        landmark: ""
                    }
                ],
                department_ID: ""
            });
            this.getView().setModel(newEmployeeModel, "newEmployeeModel");

        },
        onCreate: async function () {
            const that = this,
                oNewData = this.getView().getModel("newEmployeeModel").getData();
            const oModel = this.getOwnerComponent().getModel("ModelV2");
            await oModel.create("/employee_Data", oNewData,{
                success: async function (oData, Resp) {
                    sap.m.MessageToast.show("Created")
                    that.byId("_IDGenTable").getBinding("items").refresh() //refresh table
                    await that.onClose();
                },
                error: function (error) {
                    sap.m.MessageToast.show("Creation Failed" + error)
                }
            })

        },
        onDelete: async function () {
            const that = this;
            const oSelected = this.byId("_IDGenTable").getSelectedItem(),
                userId = oSelected.getBindingContext().getObject().ID
            const oModel = this.getOwnerComponent().getModel("ModelV2");
            await oModel.remove(`/employee_Data('${userId}')`, {
                success: function (oData, response) {
                    sap.m.MessageToast.show("Deleted")
                    that.byId("_IDGenTable").getBinding("items").refresh();
                },
                error: function (error) {
                    sap.m.MessageToast.show("Deletion Failed" + error)
                }
            })

        },
        loadCreateFragment: async function (oEve) {
            this.oFragment = await Fragment.load({
                id: this.getView().getId(),
                name: `com.app.employeeapp.fragments.create`,
                controller: this
            });
            this.getView().addDependent(this.oFragment);
            this.oFragment.open()
            if (oEve.oSource.mProperties.text === "Add") {
                this.byId("_IDGenButton4").setVisible(false);
                this.byId("_IDGenButton5").setVisible(true);
            }else{
                this.byId("_IDGenButton4").setVisible(true);
                this.byId("_IDGenButton5").setVisible(false);

            }
        },
        onClose: function () {
            if(this.oFragment.isOpen()){
                this.oFragment.close()
                this.oFragment.destroy()
                this.getView().getModel("newEmployeeModel").setData({});
            }
        },
        onEdit: async function (oEve) {
            var oSelected = this.byId("_IDGenTable").getSelectedItem();
            if (oSelected) {
                this.oFragment = await Fragment.load({
                    id: this.getView().getId(),
                    name: `com.app.employeeapp.fragments.create`,
                    controller: this
                });
                this.getView().addDependent(this.oFragment);
                this.oFragment.open()
                if (oEve.oSource.mProperties.text === "Add") {
                    this.byId("_IDGenButton4").setVisible(false);
                    this.byId("_IDGenButton5").setVisible(true);
                }else{
                    this.byId("_IDGenButton4").setVisible(true);
                    this.byId("_IDGenButton5").setVisible(false);
                }
                var oSelectedData = oSelected.getBindingContext().getObject();
                this.getView().getModel("newEmployeeModel").setData(oSelectedData)
                this.getView().getModel("newEmployeeModel").setProperty("/department_ID", oSelectedData.department.ID);
            }
            else {
                sap.m.MessageToast.show("Select an item to edit")
            }
        },
        onUpdate: function () {
            const that = this;
            const oPayload = this.getView().getModel("newEmployeeModel").getData();
            const oSelected = this.byId("_IDGenTable").getSelectedItem(),
                userId = oSelected.getBindingContext().getObject().ID
            const oModel = this.getOwnerComponent().getModel("ModelV2");
            oPayload.department = {}
            oPayload.department_ID = this.byId("_IDGenInput4").getValue();

            oModel.update(`/employee_Data('${userId}')`, oPayload, {
                success: async function (Resp) {
                    sap.m.MessageToast.show("Updated successfully")
                    that.byId("_IDGenTable").getBinding("items").refresh();
                    await that.onClose();
                },
                error: function (error) {
                    sap.m.MessageToast.show("Update Failed" + error)
                }
            })
        }
    });
});