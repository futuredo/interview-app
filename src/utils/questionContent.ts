export const extractQuestionSection = (content: string): string => {
    if (!content) return '';

    // 捕获“题目”小节的正文：允许 <h2> 内嵌标签（如 <a>）且宽松匹配
    const match = content.match(/<h2[^>]*>[\s\S]*?题目[\s\S]*?<\/h2>([\s\S]*?)(?=<hr>|<h2|$)/i);
    if (match) {
        return match[1].trim();
    }

    return content;
};

// 抽取“答案/解析”部分：抓取题目小节后的内容，若失败则回退到常见的解析标题
export const extractAnswerSection = (content: string): string => {
    if (!content) return '';

    const afterQuestion = content.match(/<h2[^>]*>[\s\S]*?题目[\s\S]*?<\/h2>[\s\S]*?<hr\s*\/?>([\s\S]*)/i);
    if (afterQuestion) {
        return afterQuestion[1].trim();
    }

    const fromAnalysis = content.match(/<h2[^>]*>[\s\S]*?(?:深入解析|答题示例|解析|参考答案)[\s\S]*?<\/h2>([\s\S]*)/i);
    if (fromAnalysis) {
        return fromAnalysis[1].trim();
    }

    return content;
};
