# Prisoner Assessment Tool Targeting Estimated Risk and Needs (PATTERN) Interactive Tool

This repo contains the code for the interactive "quiz" [Prisoner Assessment Tool Targeting Estimated Risk and Needs (PATTERN) Interactive Tool](https://apps.urban.org/features/risk-assessment/). This feature allows users to explore how different risk factors affect an individual's risk score and category which in turn determines eligibility for early release from prison. This feature is an interactive version of the [Prisoner Assessment Tool Targeting Estimated Risk and Needs (PATTERN)](https://www.bop.gov/inmates/fsa/docs/the-first-step-act-of-2018-risk-and-needs-assessment-system-updated.pdf) developed by the US Department of Justice.

Note: a substantial update of the quiz is currently underway. The update is on the `add-violent-model` branch.

## Data inputs
The following file is sourced as input for the quiz:
- `data\questions.json` - a json of the questions and answer options for the quiz as well as point values for each answer option by gender.

## Data processing scripts
None. `data\questions.json` is directly ingested into `js\main.js`.

## How to update
Any updates to the questions, answers or point values need to be made manually directly in `data\questions.json`.