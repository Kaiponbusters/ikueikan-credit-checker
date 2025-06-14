import { NextRequest, NextResponse } from 'next/server';

// シラバスページのURL
const SYLLABUS_URL = process.env.NEXT_PUBLIC_SYLLABUS_URL || 'https://www.ikueikan.ac.jp/2025/syllabus2025.html';

// エラーレスポンスの型
interface ErrorResponse {
  error: string;
  message: string;
}

// スクレイピング結果の型
interface ScrapedCourse {
  id?: string;
  name: string;
  instructor?: string;
  credits?: number;
  year?: number;
  term?: string;
  description?: string;
}

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータから検索条件を取得
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const instructor = searchParams.get('instructor');
    const year = searchParams.get('year');

    // シラバスページを取得
    const response = await fetch(SYLLABUS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch syllabus: ${response.status}`);
    }

    const html = await response.text();

    // HTMLパースのシミュレーション
    // 実際の実装では、cheerioやpuppeteerなどのライブラリを使用することを推奨
    // ここでは、基本的な正規表現でのパース例を示します
    
    const courses: ScrapedCourse[] = [];
    
    // シンプルなHTMLパターンマッチング（実際のHTML構造に合わせて調整が必要）
    const coursePattern = /<div class="course-item">([\s\S]*?)<\/div>/g;
    const matches = html.matchAll(coursePattern);
    
    for (const match of matches) {
      const courseHtml = match[1];
      
      // 科目情報の抽出（実際のHTML構造に合わせて調整が必要）
      const nameMatch = courseHtml.match(/<h3[^>]*>([^<]+)<\/h3>/);
      const instructorMatch = courseHtml.match(/担当[：:]\s*([^<\n]+)/);
      const creditsMatch = courseHtml.match(/(\d+)\s*単位/);
      const yearMatch = courseHtml.match(/(\d+)\s*年次/);
      const termMatch = courseHtml.match(/(前期|後期|通年)/);
      
      const course: ScrapedCourse = {
        name: nameMatch ? nameMatch[1].trim() : '',
        instructor: instructorMatch ? instructorMatch[1].trim() : undefined,
        credits: creditsMatch ? parseInt(creditsMatch[1]) : undefined,
        year: yearMatch ? parseInt(yearMatch[1]) : undefined,
        term: termMatch ? termMatch[1] : undefined
      };
      
      // フィルタリング
      if (keyword && !course.name.toLowerCase().includes(keyword.toLowerCase())) {
        continue;
      }
      if (instructor && course.instructor && !course.instructor.includes(instructor)) {
        continue;
      }
      if (year && course.year && course.year !== parseInt(year)) {
        continue;
      }
      
      courses.push(course);
    }

    // 結果を返す
    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    const errorResponse: ErrorResponse = {
      error: 'SCRAPING_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POSTメソッド（将来的な拡張用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 特定のURLからのスクレイピングなど、より高度な機能を実装可能
    
    return NextResponse.json({
      success: true,
      message: 'POST method not implemented yet'
    });
    
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: 'BAD_REQUEST',
      message: 'Invalid request body'
    };
    
    return NextResponse.json(errorResponse, { status: 400 });
  }
}