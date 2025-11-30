import { useState } from "react";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const faqs = [
    {
      question: "How does it work? How will I know when my group is formed?",
      answer: (
        <>
          Once you submit your travel details, our system automatically starts
          matching you with other students going in the same direction at a
          similar time. When enough members found, group is successfully formed
          and you will instantly receive an email with contact details of group
          members.
        </>
      ),
    },
    {
      question:
        "Why do I need to sign in with my @vitstudent.ac.in account? Is it safe to provide it?",
      answer: (
        <>
          We only use your @vitstudent.ac.in email to verify that you are a
          genuine VIT student.This helps us to Prevent fake or spam ride
          requests and Keep the groups safe, trusted, and college-exclusive.
          Your email is used purely for authentication. We only share it with
          your group members for contact purpose.Verification happens securely
          through <strong>Google’s OAuth 2.0 </strong>.
        </>
      ),
    },
    {
      question:
        "Why do you need my contact number? I’m not comfortable sharing it.",
      answer: (
        <>
          We ask for your contact number so that your group members can reach
          you quickly once a group is formed. Remember - your number is not made
          public anywhere outside your small travel group. It’s actually more
          private than sending message in WhatsApp groups where anyone can see
          your number. <br /> However, if you still don’t feel comfortable
          sharing it, you can enter <strong>0000000000</strong>. Just keep in
          mind that without a number: Your group members won’t be able to call
          or message you instantly, You will need to contact them through email
          manually and share numbers with them.
        </>
      ),
    },
  ];

  return (
    <div className="w-full mt-20 px-[10%] py-8 z-10 relative">
      <h1 className="text-cyan-500 text-2xl md:text-3xl font-bold mb-10 text-center">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-slate-700 py-4 cursor-pointer"
          >
            <button
              onClick={() => handleToggle(index)}
              className="flex justify-between items-center w-full text-left text-lg md:text-xl font-medium text-slate-200 hover:text-cyan-300 transition-colors"
            >
              {faq.question}
              <span className="text-slate-300">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="mt-2 text-gray-400">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
