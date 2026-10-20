export interface CategoryScores {
  keyword_alignment: number;
  required_skills: number;
  relevant_experience: number;
  section_completeness: number;
  formatting_parsing: number;
  achievement_quality: number;
}

export interface KeywordItem {
  keyword: string;
  frequency_in_jd: number;
  found_in_resume: boolean;
  frequency_in_resume: number;
}

export interface SkillMatchItem {
  skill: string;
  category: string;
  status: 'demonstrated' | 'mentioned' | 'missing';
  evidence: string | null;
  suggestion: string;
}

export interface FormattingWarning {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  fix_suggestion: string;
}

export interface RecommendationItem {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action_type: 'rewrite' | 'add_skill' | 'formatting' | 'experience';
}

export interface AnalysisResponse {
  id: string;
  filename: string;
  file_type: string;
  job_title: string;
  job_description: string;
  overall_score: number;
  category_scores: CategoryScores;
  matched_keywords: KeywordItem[];
  missing_keywords: KeywordItem[];
  skills_analysis: SkillMatchItem[];
  formatting_warnings: FormattingWarning[];
  recommendations: RecommendationItem[];
  parsed_sections: {
    contact?: {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      linkedin?: string | null;
      github?: string | null;
    };
    sections?: Record<string, string>;
    word_count?: number;
    character_count?: number;
    achievements?: {
      metric_count: number;
      unique_action_verbs_count: number;
      bullet_count: number;
      action_verbs: string[];
    };
  };
  created_at: string;
}

export interface AnalysisListItem {
  id: string;
  filename: string;
  job_title: string;
  overall_score: number;
  created_at: string;
}

export interface RewriteRequest {
  text: string;
  style: 'professional' | 'concise' | 'technical' | 'impact-focused';
  section_type: 'bullet' | 'summary' | 'headline' | 'project';
  target_role?: string;
}

export interface RewriteResponse {
  original: string;
  rewritten: string;
  style: string;
  improvements_made: string[];
  facts_preserved: boolean;
  notes: string | null;
  ai_configured: boolean;
}

export interface InterviewQuestionItem {
  category: 'technical' | 'project' | 'behavioral' | 'hr';
  question: string;
  assessment_focus: string;
  suggested_approach: string;
  sample_outline: string;
}

export interface InterviewResponse {
  role: string;
  questions: InterviewQuestionItem[];
  ai_configured: boolean;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  ai_status: {
    gemini_active: boolean;
    openai_active: boolean;
    provider: string;
  };
}
