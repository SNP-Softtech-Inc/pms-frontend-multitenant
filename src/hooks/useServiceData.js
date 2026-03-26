import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { templateAPI } from "../services/api";

const useServiceData = () => {
  const [servicedata, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServiceData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await templateAPI.getAllServiceTemplates();
      setServiceData(response.data.serviceTemplate || []);
     
    } catch (error) {
      console.error("Error fetching service data:", error);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchservicebyid = useCallback(async (id, rowIndex, setRows) => {
    try {
      const response = await templateAPI.getServiceTemplateById(id);
      const service = Array.isArray(response.data.serviceTemplate)
        ? response.data.serviceTemplate[0]
        : response.data.serviceTemplate;
      
      const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
      
      const updatedRow = {
        productName: service.serviceName || "",
        description: service.description || "",
        rate: `$${rate.toFixed(2)}`,
        qty: "1",
        amount: `$${rate.toFixed(2)}`,
        tax: service.tax || false,
        isDiscount: false,
      };

      setRows(prevRows => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
        return updatedRows;
      });
    } catch (error) {
      console.error("Error fetching service by ID:", error);
      toast.error("Failed to fetch service details");
    }
  }, []);

  const createServiceTemplate = useCallback(async (data) => {
    try {
      const response = await templateAPI.createServiceTemplate(data);
      if (response.data.message === "ServiceTemplate created successfully") {
        toast.success("Service created successfully");
        await fetchServiceData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(error.response?.data?.message || "Failed to create service");
      return false;
    }
  }, [fetchServiceData]);

  const updateServiceTemplate = useCallback(async (id, data) => {
    try {
      const response = await templateAPI.updateServiceTemplate(id, data);
      toast.success("Service updated successfully");
      await fetchServiceData();
      return true;
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.message || "Failed to update service");
      return false;
    }
  }, [fetchServiceData]);

  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));

  return {
    servicedata,
    serviceoptions,
    loading,
    fetchServiceData,
    fetchservicebyid,
    createServiceTemplate,
    updateServiceTemplate,
  };
};

export default useServiceData;