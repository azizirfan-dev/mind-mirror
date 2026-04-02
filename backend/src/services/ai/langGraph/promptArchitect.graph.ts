import { StateGraph } from '@langchain/langgraph';
import { PromptArchitectStateAnnotation } from './state';
import { patternDetectiveNode } from './patternDetective.node';
import { promptArchitectNode } from './promptArchitect.node';
import { getInsightsData } from '../../insights/insights.service';

const graph = new StateGraph(PromptArchitectStateAnnotation)
  .addNode('patternDetective', patternDetectiveNode)
  .addNode('promptArchitect', promptArchitectNode)
  .addEdge('__start__', 'patternDetective')
  .addEdge('patternDetective', 'promptArchitect')
  .addEdge('promptArchitect', '__end__')
  .compile();

export const runPromptArchitect = async (userId: string): Promise<string> => {
  const insights = await getInsightsData(userId, '7d');
  const result = await graph.invoke({
    userId,
    emotionTrend: insights.emotionTrend,
    emotionAverages: insights.emotionAverages,
    dominantPattern: '',
    generatedPrompt: '',
    error: null,
  });
  return result.generatedPrompt;
};
