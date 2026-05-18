import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

interface Customer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  published: boolean;
}

interface Testimonial {
  id: string;
  customerName: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  published: boolean;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/customers', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.customers) {
            setCustomers(data.customers.customers ?? []);
            setTestimonials(data.customers.testimonials ?? []);
          }
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const saveToServer = async (c: Customer[], t: Testimonial[]) => {
    const response = await apiFetch('/api/admin/content/customers', {
      method: 'PUT',
      body: JSON.stringify({ customers: { customers: c, testimonials: t } }),
    });
    if (response.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const [customerForm, setCustomerForm] = useState({
    name: '',
    logo: '',
    industry: '',
  });

  const [testimonialForm, setTestimonialForm] = useState({
    customerName: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
  });

  const handleOpenCustomerModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustomerForm(customer);
    } else {
      setEditingCustomer(null);
      setCustomerForm({ name: '', logo: '', industry: '' });
    }
    setIsCustomerModalOpen(true);
  };

  const handleOpenTestimonialModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialForm(testimonial);
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({
        customerName: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        avatar: '',
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const handleSubmitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Customer[];
    if (editingCustomer) {
      updated = customers.map((c) => (c.id === editingCustomer.id ? { ...customerForm, id: c.id, published: c.published ?? true } : c));
    } else {
      updated = [...customers, { ...customerForm, id: Date.now().toString(), published: true }];
    }
    setCustomers(updated);
    setIsCustomerModalOpen(false);
    await saveToServer(updated, testimonials);
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Testimonial[];
    if (editingTestimonial) {
      updated = testimonials.map((t) =>
        t.id === editingTestimonial.id ? { ...testimonialForm, id: t.id, published: t.published ?? true } : t
      );
    } else {
      updated = [...testimonials, { ...testimonialForm, id: Date.now().toString(), published: true }];
    }
    setTestimonials(updated);
    setIsTestimonialModalOpen(false);
    await saveToServer(customers, updated);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      await saveToServer(updated, testimonials);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      setTestimonials(updated);
      await saveToServer(customers, updated);
    }
  };

  const moveCustomer = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= customers.length) return;
    const updated = [...customers];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setCustomers(updated);
    await saveToServer(updated, testimonials);
  };

  const moveTestimonial = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= testimonials.length) return;
    const updated = [...testimonials];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setTestimonials(updated);
    await saveToServer(customers, updated);
  };

  const toggleCustomerPublished = async (id: string) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, published: !(c.published ?? true) } : c));
    setCustomers(updated);
    await saveToServer(updated, testimonials);
  };

  const toggleTestimonialPublished = async (id: string) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, published: !(t.published ?? true) } : t));
    setTestimonials(updated);
    await saveToServer(customers, updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-gray-900">Customers Management</h1>
          <p className="text-gray-600 mt-1">Manage customer logos and testimonials</p>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
        <>
        {/* Customer Logos Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-900">Customer Logos</h2>
            <button
              onClick={() => handleOpenCustomerModal()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Customer
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customers.map((customer, index) => (
              <div key={customer.id} className={`border rounded-lg p-4 ${(customer.published ?? true) ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
                <img
                  src={customer.logo}
                  alt={customer.name}
                  className="w-full h-20 object-contain mb-3"
                />
                <h3 className="text-sm text-gray-900 mb-1 truncate">{customer.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{customer.industry}</p>
                <div className="flex items-center gap-1 mb-2">
                  <button onClick={() => moveCustomer(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveUp className="w-3 h-3" /></button>
                  <button onClick={() => moveCustomer(index, 'down')} disabled={index === customers.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveDown className="w-3 h-3" /></button>
                  <button onClick={() => toggleCustomerPublished(customer.id)} className="p-1 text-gray-400 hover:text-gray-600" title={(customer.published ?? true) ? 'Hide' : 'Show'}>
                    {(customer.published ?? true) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenCustomerModal(customer)}
                    className="flex-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    <Edit className="w-3 h-3 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="flex-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-900">Customer Testimonials</h2>
            <button
              onClick={() => handleOpenTestimonialModal()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={`border rounded-lg p-4 ${(testimonial.published ?? true) ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.customerName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-gray-900">{testimonial.customerName}</h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.position} at {testimonial.company}
                        </p>
                        <div className="flex mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveTestimonial(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
                        <button onClick={() => moveTestimonial(index, 'down')} disabled={index === testimonials.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
                        <button onClick={() => toggleTestimonialPublished(testimonial.id)} className="p-1 text-gray-400 hover:text-gray-600" title={(testimonial.published ?? true) ? 'Hide' : 'Show'}>
                          {(testimonial.published ?? true) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenTestimonialModal(testimonial)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{testimonial.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {/* Customer Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <form onSubmit={handleSubmitCustomer} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <ImageUpload
                      value={customerForm.logo}
                      onChange={(url) => setCustomerForm({ ...customerForm, logo: url })}
                      label="Company Logo"
                      previewClassName="w-32 h-20 object-contain border border-gray-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Industry</label>
                    <input
                      type="text"
                      value={customerForm.industry}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, industry: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      {editingCustomer ? 'Update' : 'Add'} Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomerModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Testimonial Modal */}
        {isTestimonialModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={testimonialForm.customerName}
                        onChange={(e) =>
                          setTestimonialForm({ ...testimonialForm, customerName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={testimonialForm.position}
                        onChange={(e) =>
                          setTestimonialForm({ ...testimonialForm, position: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={testimonialForm.company}
                      onChange={(e) =>
                        setTestimonialForm({ ...testimonialForm, company: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Testimonial Content</label>
                    <textarea
                      value={testimonialForm.content}
                      onChange={(e) =>
                        setTestimonialForm({ ...testimonialForm, content: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Rating (1-5)</label>
                      <select
                        value={testimonialForm.rating}
                        onChange={(e) =>
                          setTestimonialForm({
                            ...testimonialForm,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <ImageUpload
                        value={testimonialForm.avatar}
                        onChange={(url) => setTestimonialForm({ ...testimonialForm, avatar: url })}
                        label="Avatar"
                        previewClassName="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      {editingTestimonial ? 'Update' : 'Add'} Testimonial
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTestimonialModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
