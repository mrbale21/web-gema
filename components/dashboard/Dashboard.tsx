"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  FileText,
  BarChart3,
  Tag,
  User,
  Home,
} from "lucide-react";
import { NewsType } from "@/types/news";
import { UserType } from "@/types/users";
import { ProductType } from "@/types/product";
import { TenantType } from "@/types/tenant";

export default function Dashboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [blogs, setBlogs] = useState<NewsType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tenant, setTenant] = useState<TenantType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, blogsRes, tenantRes, productsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/news"),
        fetch("/api/tenant"),
        fetch("/api/product"),
      ]);

      setUsers(usersRes.ok ? await usersRes.json() : []);
      setBlogs(blogsRes.ok ? await blogsRes.json() : []);
      setTenant(tenantRes.ok ? await tenantRes.json() : null);
      const productsData: ProductType[] = productsRes.ok
        ? await productsRes.json()
        : [];
      setProducts(productsData || []);
    } catch (err) {
      console.error(err);
      alert("Gagal fetch data dashboard");
    }
  };

  // const getStatusColor = (status?: string) => {
  //   switch (status) {
  //     case "published":
  //       return "bg-green-100 text-green-800";
  //     case "draft":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "archived":
  //       return "bg-gray-100 text-gray-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: User,
      color: "bg-blue-500",
    },
    {
      label: "Total blogs",
      value: blogs.length,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "Tenant",
      value: tenant?.nameTenant || "-",
      icon: Home,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Ringkasan data utama aplikasi.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
        </div>
        <div className="p-6 space-y-4">
          {users
            .slice(-5)
            .reverse()
            .map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Recent blogs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Blogs</h2>
        </div>
        <div className="p-6 space-y-4">
          {blogs
            .slice(-5)
            .reverse()
            .map((blog) => (
              <div
                key={blog.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{blog.title}</p>
                  <p className="text-sm text-gray-500">
                    By {blog.editor || "-"} | {blog.tag || "-"}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Tenant Info */}
      {tenant && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          {tenant.imageLogo && (
            <img
              src={tenant.imageLogo}
              alt="Logo Tenant"
              className="w-20 h-20 object-contain rounded"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 text-lg">
              {tenant.nameTenant}
            </p>
            <p className="text-sm text-gray-500">{tenant.email || "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
