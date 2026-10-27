# @puiya/shared

Types, Zod schemas and Thai formatting helpers used by every app. If two apps need the same
rule, it belongs here.

| Module    | What it does                                                           |
| --------- | ---------------------------------------------------------------------- |
| `money`   | Integer satang type, parse typed baht, format `฿1,250.50`, line totals |
| `date`    | Buddhist-era (พ.ศ.) dates in Bangkok time                              |
| `phone`   | Normalise Thai mobile numbers to `+66…`, format as `081-234-5678`      |
| `schemas` | Product, sale and sale-line schemas shared by mobile, API and sync     |
