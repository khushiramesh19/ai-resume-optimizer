import {
  AnalysisResponse,
  AnalysisListItem,
  RewriteRequest,
  RewriteResponse,
  InterviewResponse,
  HealthResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string,
  onProgress?: (percent: number) => void
): Promise<AnalysisResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_title', jobTitle);
    formData.append('job_description', jobDescription);

    xhr.open('POST', `${API_BASE}/analyze`);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: AnalysisResponse = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error('Failed to parse analysis server response.'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.detail || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload. Please ensure backend server is running.'));
    };

    xhr.send(formData);
  });
}

export async function getAnalyses(): Promise<AnalysisListItem[]> {
  const res = await fetch(`${API_BASE}/analyses`);
  if (!res.ok) {
    throw new Error('Failed to fetch previous resume analyses.');
  }
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyses/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to retrieve analysis with ID: ${id}`);
  }
  return res.json();
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/analyses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete analysis record.');
  }
}

export async function rewriteContent(req: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${API_BASE}/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to rewrite resume text.');
  }
  return res.json();
}

export async function getInterviewPrep(analysisId: string): Promise<InterviewResponse> {
  const res = await fetch(`${API_BASE}/interview/${analysisId}`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to generate interview preparation questions.');
  }
  return res.json();
}

export async function getGenericInterviewPrep(role: string = 'Full Stack Engineer'): Promise<InterviewResponse> {
  const res = await fetch(`${API_BASE}/interview-generic?role=${encodeURIComponent(role)}`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to generate interview preparation questions.');
  }
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error('Failed to query backend health.');
  }
  return res.json();
}
