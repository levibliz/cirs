
const API_BASE_URL = '/api';

export async function getReports(token: string | null) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    let errorMessage = `Failed to fetch reports: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }
      }
    } catch (e) {
      // If parsing JSON fails, use the default error message
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

export async function createReport(
  reportData: {
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl?: string;
  },
  token: string | null
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers,
    body: JSON.stringify(reportData),
  });

  if (!res.ok) {
    let errorMessage = 'Failed to create report';
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }
      }
    } catch (e) {
      errorMessage = `Failed to create report: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

export async function updateReport(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    category: string;
    location: string;
    status: string;
    imageUrl: string;
  }>,
  token: string | null
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    let errorMessage = 'Failed to update report';
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorMessage = `Failed to update report: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

export async function deleteReport(id: string, token: string | null) {
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    let errorMessage = 'Failed to delete report';
    try {
      const errorData = await res.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorMessage = `Failed to delete report: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
}
