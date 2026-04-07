import { RichTextarea } from "@/components/editor/rich-textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeHtmlInline } from "@/components/macfast/safe-html";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Check, CirclePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface OptionsTabProps {
  question: Question | null;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
}

export default function OptionsTab({ question, setQuestion }: OptionsTabProps) {
  const [currentOptionIndex, setCurrentOptionIndex] = useState<string>("");
  const [answerIndex, setAnswerIndex] = useState<number>(0);
  const isIndexAnswer = (index: number) => {
    return index === answerIndex;
  };

  useEffect(() => {
    if (question && question.options) {
      const currentAnswerIndex = question.options.findIndex(
        (option) => option.is_answer,
      );
      setAnswerIndex(currentAnswerIndex !== -1 ? currentAnswerIndex : 0);
    }
  }, [question]);
  const deleteQuestionOption = (optionIndex: number) => {
    setQuestion((prev) => {
      if (!prev || !prev.options) return prev;
      const updatedOptions = prev.options.filter(
        (_, index) => index !== optionIndex,
      );
      return { ...prev, options: updatedOptions };
    });
    if (!question || !question.options) return;
    if (answerIndex === optionIndex) {
      if (answerIndex >= question.options.length) {
        setAnswerIndex(question.options.length - 2);
      } else if (answerIndex <= 0) {
        setAnswerIndex(0);
      } else {
        setAnswerIndex(answerIndex - 1);
      }
    }
  };

  const setOptionAsAnswer = (optionIndex: number) => {
    setQuestion((prev) => {
      if (!prev || !prev.options) return prev;
      const updatedOptions = prev.options.map((option, index) => ({
        ...option,
        is_answer: index === optionIndex,
      }));
      return { ...prev, options: updatedOptions };
    });
    setAnswerIndex(optionIndex);
  };

  const addQuestionOption = () => {
    const newOption: QuestionOption = {
      public_id: "",
      content: "",
      is_answer: false,
      selection_frequency: 0,
    };
    setQuestion((prev) => {
      if (!prev) return prev;
      const updatedOptions = prev.options
        ? [...prev.options, newOption]
        : [newOption];
      return { ...prev, options: updatedOptions };
    });
  };

  const updateOption = (
    optionIndex: number,
    updatedOption: Partial<QuestionOption>,
  ) => {
    setQuestion((prev) => {
      if (!prev || !prev.options) return prev;
      const updatedOptions = prev.options.map((option, index) =>
        index === optionIndex ? { ...option, ...updatedOption } : option,
      );
      return { ...prev, options: updatedOptions };
    });
  };

  return (
    <TabsContent value="options" className="flex-1 overflow-hidden">
      <div className="flex flex-col gap-4 h-full overflow-auto">
        <Label className="text-sm font-light">
          The options are not guaranteed to be in this order when shown to
          students.
        </Label>
        <Accordion
          value={`option-${currentOptionIndex}`}
          onValueChange={(value) => {
            setCurrentOptionIndex(value.charAt(value.length - 1));
          }}
          type="single"
          collapsible
        >
          {question?.options &&
            question.options.map((option, index) => {
              return (
                <div key={index}>
                  <AccordionItem value={`option-${index}`}>
                    <div className="inline-flex items-center justify-between w-full">
                      <div className="inline-flex items-center gap-2">
                        <AccordionTrigger className="hover:cursor-pointer w-full py-4 items-center">
                          <div className="inline-flex gap-2">
                            <h1 className="text-md font-medium w-full line-clamp-2">
                              <SafeHtmlInline
                                html={option.content || `Option ${index + 1}`}
                              />
                            </h1>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isIndexAnswer(index) ? (
                          <Button
                            variant="tertiary"
                            className="w-40" // standard 10rem width
                            onClick={() => setOptionAsAnswer(index)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Set as Answer
                          </Button>
                        ) : (
                          <Badge
                            variant="default"
                            className="flex w-36 items-center justify-center text-sm"
                          >
                            Correct Answer
                          </Badge>
                        )}

                        <Button
                          variant="tertiary"
                          onClick={() => deleteQuestionOption(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <AccordionContent>
                      <div className="">
                        <div className=" gap-4">
                          <h2 className="text-lg  font-semibold">Content</h2>
                          <RichTextarea
                            className=""
                            value={option.content ?? ""}
                            onChange={(html) =>
                              updateOption(index, { content: html })
                            }
                          />
                        </div>
                        <div className=" gap-4">
                          <h2 className="text-lg  font-semibold">
                            Explanation
                          </h2>
                          <p className="text-xs text-muted-foreground m-1">This feature is still under development!</p>
                          <RichTextarea
                            className=""
                            placeholder="TODO"
                            value={""}
                            // onChange={(html) => updateOption(index, { explanation: html })}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              );
            })}
        </Accordion>
        <div className="flex justify-center">
          <Button
            className="w-fit"
            variant="tertiary"
            onClick={addQuestionOption}
          >
            <CirclePlus />
            Add an option
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
