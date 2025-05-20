# LLM Cost Estimator

A tool for estimating and tracking costs associated with using large language models (LLMs) in applications.

## Description

LLM Cost Estimator helps developers and organizations:

- Calculate expected costs for LLM API usage
- Track actual token consumption and associated expenses
- Compare costs across different models and providers
- Optimize LLM usage for cost efficiency

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/llm-cost-estimator.git
cd llm-cost-estimator
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application should now be running at http://localhost:3000

## CSV Data Maintenance

The application uses a CSV file to store LLM model pricing data. To update or add new models:

1. Open the CSV file at `src/data/llm_models.csv`
2. Maintain the following format for each row:

   ```
   provider,model,input_price,output_price,pricing_url
   ```

   - `provider`: The company providing the LLM (e.g., OpenAI, Anthropic)
   - `model`: The specific model name (e.g., GPT-4, Claude 3)
   - `input_price`: Cost per 1,000 input tokens in USD
   - `output_price`: Cost per 1,000 output tokens in USD
   - `pricing_url`: URL to the provider's pricing documentation

3. After updating the CSV file, rebuild the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

4. For production deployment, use:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```
