import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { templateAPI } from "../services/api";

const useCategoryData = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await templateAPI.getAllCategories();
      setCategoryData(response.data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryName) => {
    if (!categoryName?.trim()) {
      toast.error("Category name is required");
      return false;
    }

    try {
      const response = await templateAPI.createCategory({ categoryName });
      if (response.data.message === "Category created successfully") {
        toast.success("Category created successfully");
        await fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
      return false;
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, categoryName) => {
    try {
      const response = await templateAPI.updateCategory(id, { categoryName });
      toast.success("Category updated successfully");
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
      return false;
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await templateAPI.deleteCategory(id);
      toast.success("Category deleted successfully");
      await fetchCategories();
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
      return false;
    }
  }, [fetchCategories]);

  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));

  return {
    categoryData,
    categoryoptions,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategoryData;