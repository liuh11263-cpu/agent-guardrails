import { NextResponse } from "next/server";
import { getSkillItems, getDebugCases, getPromptItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const category = searchParams.get("category") || ""; // 可选: Prompt | Debug | Skill
    
    const normalizedQuery = query.trim().toLowerCase();

    // 1. 整理 Debug Cases 映射
    const debugs = getDebugCases().map(item => {
      // 提取步骤 section 的内容
      const stepSection = item.sections.find(s => /步骤|修复/i.test(s.title));
      const steps = stepSection 
        ? stepSection.content.split("\n").map(l => l.replace(/^\d+\.\s*/, "").trim()).filter(Boolean)
        : [];
      
      // 提取验证 section 的内容
      const verSection = item.sections.find(s => /验证/i.test(s.title));
      const verification = verSection
        ? verSection.content.split("\n").map(l => l.replace(/^-\s*/, "").trim()).filter(Boolean)
        : [];

      return {
        id: `debug_${item.slug}`,
        title: item.title,
        slug: item.slug,
        category: "Debug",
        domain: item.category,
        summary: item.summary,
        use_case: item.errorType || item.summary,
        trigger_keywords: item.tags,
        inputs: ["报错日志", "受影响代码", "环境配置"],
        steps: steps.length ? steps : ["分析报错日志", "定位根因", "应用修复", "运行验证命令"],
        output_format: ["根因解释", "修复方案", "验证命令"],
        constraints: ["优先给最小可行方案，不要过度重构"],
        verification: verification.length ? verification : ["修复后报错消失", "编译/构建通过"],
        example_prompt: item.prompt,
        copy_content: item.body,
        source_name: "local debug archive",
        source_url: `https://github.com/your-repo/blob/main/content/debug/${item.slug}.md`,
        source_type: "github",
        quality_score: 5,
        approved: true
      };
    });

    // 2. 整理 Prompts 映射
    const prompts = getPromptItems().map(item => ({
      id: `prompt_${item.slug}`,
      title: item.title,
      slug: item.slug,
      category: "Prompt",
      domain: item.category,
      summary: item.scenario,
      use_case: item.scenario,
      trigger_keywords: item.models,
      inputs: ["任务背景"],
      steps: ["阅读 Prompt", "结合业务替换占位符", "发送给模型"],
      output_format: ["模型响应内容"],
      constraints: ["严格按照 Prompt 指令执行"],
      verification: ["输出符合预期格式"],
      example_prompt: item.prompt,
      copy_content: item.prompt || item.body,
      source_name: "local prompt archive",
      source_url: `https://github.com/your-repo/blob/main/content/prompts/${item.slug}.md`,
      source_type: "github",
      quality_score: 4,
      approved: true
    }));

    // 3. 整理 Skills
    const skills = getSkillItems().map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      domain: item.domain,
      summary: item.summary,
      use_case: item.use_case,
      trigger_keywords: item.trigger_keywords,
      inputs: item.inputs,
      steps: item.steps,
      output_format: item.output_format,
      constraints: item.constraints,
      verification: item.verification,
      example_prompt: item.example_prompt,
      copy_content: item.copy_content,
      source_name: item.source_name,
      source_url: item.source_url,
      source_type: item.source_type,
      quality_score: item.quality_score,
      approved: item.approved
    }));

    const allItems = [...debugs, ...prompts, ...skills];

    // 4. 执行多维过滤
    const filtered = allItems.filter(item => {
      // 分类过滤
      const matchesCategory = 
        !category || 
        item.category.toLowerCase() === category.toLowerCase() ||
        (category.toLowerCase() === "skill" && !["debug", "prompt"].includes(item.category.toLowerCase()));
      
      if (!matchesCategory) return false;

      // 关键词检索
      if (!normalizedQuery) return true;

      const haystack = [
        item.title,
        item.category,
        item.domain,
        item.summary,
        item.use_case,
        item.trigger_keywords.join(" "),
        item.copy_content,
        item.steps.join(" "),
        item.constraints.join(" "),
        item.verification.join(" ")
      ].join(" ").toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    // 限制返回数量，以节省 Agent 的 Token 消耗 (默认最多返回 8 条最佳匹配)
    return NextResponse.json({
      success: true,
      count: filtered.length,
      results: filtered.slice(0, 8)
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
